# C — Feasibility Analysis

**Title:** Volunteer Emergency Response Alliance (VERA)

## Group Members

| ID | Name | Contribution |
|----|------|--------------|
| 2311960 | Md. Mahmudul Hasan | 100% |
| 2310604 | Ridwan Hasan Khandakar | 100% |
| 2022752 | Kazi Fatema Tuj Johra | 100% |
| 2312226 | Fouzia Abida | 100% |
| 2310690 | Syed Mehedi Hussain | 100% |
| 2210892 | Sowhardra Paul | 100% |

**Course:** CSE307 — System Analysis and Design · **Task 5(C):** Feasibility Analysis · **Currency:** BDT (৳)

---

## What Is Feasibility? (Lecture 3)

Before building a system, we must check if it is worth doing. Lecture 3 says feasibility has **three key parts**:

1. **Technical feasibility** — can we build it with the technology we have?
2. **Economic feasibility** — are the benefits worth more than the cost?
3. **Operational feasibility** — will people actually use and operate it?

In this section we focus mostly on **economic feasibility**, using costs and benefits. Lecture 3 also teaches that benefits and costs can be **tangible** (measurable in money) or **intangible** (hard to measure in money).

---

## C1. List of Expense Heads (Cost to Build the Project)

We divided our costs into **one-time costs** (paid once at the start, Year 0) and **yearly running costs** (paid every year).

### C1.1 One-Time Costs (Year 0)

| # | Expense Head | Cost (৳) |
|---|--------------|----------|
| 1 | Development labour (all activities A1–A18 from Section B) | 229,700 |
| 2 | Hardware (developer machines / test devices) | 40,000 |
| 3 | Cloud setup (server, storage, network) | 15,000 |
| 4 | Software tools & licences | 12,000 |
| 5 | Testing devices | 8,000 |
| 6 | Training material | 7,000 |
| 7 | Domain + SSL (first year) | 3,000 |
| | **Subtotal** | **314,700** |
| 8 | Contingency / risk buffer (10%) | 31,470 |
| | **Total one-time cost (Year 0)** | **346,170** |

### C1.2 Yearly Running Costs (Years 1–5)

| # | Expense Head | Cost/year (৳) |
|---|--------------|---------------|
| 1 | Cloud hosting | 36,000 |
| 2 | Maintenance & support | 60,000 |
| 3 | SMS / email service | 12,000 |
| 4 | Marketing & outreach | 20,000 |
| 5 | Domain + SSL renewal | 3,000 |
| | **Total yearly cost** | **≈ 130,000** |

---

## C2. Possible Benefits from the Project

### C2.1 Tangible Benefits (Can Be Measured in Money)

| # | Benefit |
|---|---------|
| 1 | NGOs save money because coordination is faster (less phone calls, less duplicate work) |
| 2 | Less wasted relief supplies (coverage map stops two NGOs going to the same place) |
| 3 | More donations collected because donors trust the transparent system |
| 4 | Volunteers are matched faster, saving time |
| 5 | Money from sponsors, grants, and partnerships |

Because more people will use VERA over time, the money benefit grows each year:

| Year | Estimated Benefit (৳) |
|------|-----------------------|
| Year 1 | 250,000 |
| Year 2 | 320,000 |
| Year 3 | 400,000 |
| Year 4 | 470,000 |
| Year 5 | 540,000 |

### C2.2 Intangible Benefits (Hard to Measure in Money)

- **Lives saved** and faster help during emergencies (the most important benefit).
- More **public trust** in disaster relief.
- A strong, **verified volunteer network**.
- Better **information for authorities** about which areas need help.
- More **student involvement** through certificates.

---

## C3. Net Present Value (NPV) Table

Money in the future is worth less than money today. So we bring all future amounts back to today's value using the **discount factor** from Lecture 3:

**Discount factor = 1 / (1 + i)ⁿ**, where *i* = discount rate and *n* = year number.

We use **i = 0.12 (12%)**, the same rate used in the Lecture 3 example.

**Net cash flow each year = yearly benefit − yearly running cost (৳130,000).**

| Year | Benefit (৳) | Running Cost (৳) | Net Cash Flow (৳) | Discount Factor (12%) | Present Value (৳) | Cumulative PV (৳) |
|------|-------------|-------------------|--------------------|------------------------|-------------------|-------------------|
| 0 | — | — | −346,170 | 1.0000 | −346,170 | −346,170 |
| 1 | 250,000 | 130,000 | 120,000 | 0.8929 | 107,148 | −239,022 |
| 2 | 320,000 | 130,000 | 190,000 | 0.7972 | 151,468 | −87,554 |
| 3 | 400,000 | 130,000 | 270,000 | 0.7118 | 192,186 | 104,632 |
| 4 | 470,000 | 130,000 | 340,000 | 0.6355 | 216,070 | 320,702 |
| 5 | 540,000 | 130,000 | 410,000 | 0.5674 | 232,634 | 553,336 |
| | | | | **Total PV of benefits** | **899,506** | |

### C3.1 Result

| Item | Value | Meaning |
|------|-------|---------|
| Total present value of benefits | ৳ 899,506 | |
| Total one-time cost | ৳ 346,170 | |
| **NPV = benefits − cost** | **৳ 553,336** | Positive, so the project is worth doing |

Because the **NPV is positive (greater than 0)**, the project is **economically feasible**.

---

## C4. Return on Investment (ROI) and Break-Even

### C4.1 ROI Calculation

| Item | Value (৳) |
|------|-----------|
| Total net cash flow over 5 years (120,000 + 190,000 + 270,000 + 340,000 + 410,000) | 1,330,000 |
| Total one-time cost | 346,170 |
| **Net profit (money in − money out)** | **983,830** |

**ROI = (Net profit ÷ Total cost) × 100 = (983,830 ÷ 346,170) × 100 ≈ 284%**

This means for every 1 taka we spend, we get about 2.84 taka back over five years.

### C4.2 Break-Even (Payback) Point

Using the **Cumulative PV** column from the NPV table, we see when the project stops being a loss and starts being a profit:

| Year | Cumulative PV (৳) | Status |
|------|-------------------|--------|
| Year 0 | −346,170 | Loss (we just spent the money) |
| Year 1 | −239,022 | Still recovering |
| Year 2 | −87,554 | Still recovering |
| Year 3 | +104,632 | **Break-even reached (now profit)** |
| Year 4 | +320,702 | Profit |
| Year 5 | +553,336 | Profit (equals NPV) |

The project **pays back in about 2.5 years** (during Year 3).

### C4.3 ROI / Break-Even Chart

The bar chart below shows the cumulative money position each year. Bars on the **left of the line (│)** are a loss; bars on the **right** are a profit. The project crosses from loss to profit in **Year 3**.

```
 Cumulative discounted cash flow   (each █ ≈ ৳50,000)

 Year  Amount(৳'000)   LOSS  ◄────────│────────►  PROFIT
 Y0     -346                  ███████│
 Y1     -239                    █████│
 Y2      -88                       ██│
 Y3     +105                        │██        ◄─ break-even
 Y4     +321                        │██████
 Y5     +553                        │███████████
```

---

## C5. Feasibility Summary (Lecture 3: Three Types)

| Feasibility Type | Our Result | Feasible? |
|------------------|-----------|-----------|
| **Technical** | We use known, working technology (web app + database) and the team has the skills. | Yes |
| **Economic** | NPV is positive (৳ 553,336), ROI is 284%, payback in about 2.5 years. | Yes |
| **Operational** | The system solves real problems, and NGOs, volunteers, and citizens are willing to use it. | Yes |
| **Schedule** | The project fits the 78-day plan from Section B. | Yes |

**Conclusion:** VERA is **feasible** in every way. The money benefits are greater than the cost, and there are also large social benefits (like saving lives) that cannot be measured in money.

---

## Short Answer (Summary)

We listed the project's **costs** (one-time ৳ 346,170 and yearly ৳ 130,000) and its **benefits** (both tangible money benefits and intangible social benefits). Using a **12% discount rate** and the formula **1/(1+i)ⁿ**, we made an **NPV table**; the NPV is **+৳ 553,336**, which is positive. The **ROI is about 284%** and the project **pays back in about 2.5 years**. So VERA is technically, economically, and operationally **feasible**.

---

*CSE307 — System Analysis and Design | Task 5(C) | VERA*
