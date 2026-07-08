def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_register_and_login(client, registered_user):
    me = client.post(
        "/api/v1/auth/login",
        data={"username": registered_user["email"], "password": registered_user["password"]},
    )
    assert me.status_code == 200
    assert "access_token" in me.json()


def test_register_duplicate_email(client, registered_user):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": registered_user["email"],
            "password": "another123",
            "full_name": "Dup",
            "role": "citizen",
        },
    )
    assert response.status_code == 400
    body = response.json()
    assert body["code"] == "http_400"
    assert "already" in body["detail"].lower()


def test_login_invalid_credentials(client, registered_user):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": registered_user["email"], "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_me_requires_auth(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_me_with_token(client, auth_headers):
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "citizen@example.com"


def test_create_and_list_emergencies(client, auth_headers):
    create = client.post(
        "/api/v1/emergencies",
        headers=auth_headers,
        json={
            "title": "Need ambulance",
            "description": "Medical emergency in Mirpur",
            "emergency_type": "ambulance",
            "location": "Mirpur, Dhaka",
            "latitude": 23.8,
            "longitude": 90.3,
            "contact_phone": "01700000000",
        },
    )
    assert create.status_code == 201
    created = create.json()
    assert created["title"] == "Need ambulance"

    listing = client.get("/api/v1/emergencies", headers=auth_headers)
    assert listing.status_code == 200
    assert len(listing.json()) >= 1


def test_blood_request_creates_notification_for_donor(client, db):
    # Register citizen requester
    requester = client.post(
        "/api/v1/auth/register",
        json={
            "email": "requester@example.com",
            "password": "secret123",
            "full_name": "Requester",
            "role": "citizen",
        },
    ).json()

    # Register and mark donor available
    donor_reg = client.post(
        "/api/v1/auth/register",
        json={
            "email": "donor@example.com",
            "password": "secret123",
            "full_name": "Donor",
            "role": "donor",
            "blood_group": "B+",
            "phone": "01800000000",
        },
    )
    assert donor_reg.status_code == 201

    donor_login = client.post(
        "/api/v1/auth/login",
        data={"username": "donor@example.com", "password": "secret123"},
    )
    donor_headers = {"Authorization": f"Bearer {donor_login.json()['access_token']}"}
    become = client.post(
        "/api/v1/donors/register",
        headers=donor_headers,
        json={"blood_group": "B+", "available_for_donation": True, "phone": "01800000000"},
    )
    assert become.status_code == 200

    requester_login = client.post(
        "/api/v1/auth/login",
        data={"username": "requester@example.com", "password": "secret123"},
    )
    requester_headers = {"Authorization": f"Bearer {requester_login.json()['access_token']}"}

    blood = client.post(
        "/api/v1/blood/requests",
        headers=requester_headers,
        json={
            "patient_name": "Patient",
            "blood_group": "B+",
            "units_needed": 1,
            "hospital_name": "DMCH",
            "location": "Dhaka",
            "contact_phone": "01711111111",
            "is_urgent": True,
        },
    )
    assert blood.status_code == 201

    notes = client.get("/api/v1/notifications", headers=donor_headers)
    assert notes.status_code == 200
    assert any("blood" in n["title"].lower() for n in notes.json())
    assert requester["email"] == "requester@example.com"
