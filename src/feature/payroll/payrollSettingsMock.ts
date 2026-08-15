export const payrollPolicyMock: PayrollPolicyData = {
    payDayType: "FIXED_DAY",
    payDay: 5,
    paymentMonthOffset: 1,
};

export const payrollCompensationMock: PayrollEmployeeCompensationData[] = [
    {
        employeeId: 1,
        employeeName: "이민준",
        compensations: [
            {
                id: 1,
                employmentType: "REGULAR",
                salaryType: "MONTHLY",
                baseSalary: 3200000,
                hourlyWage: null,
                weeklyContractHours: 40,
                effectiveFrom: "2026-08-01",
                effectiveTo: null,
            },
        ],
        fixedAllowances: [
            { id: 11, allowanceType: "MEAL", name: "식대", amount: 200000, effectiveFrom: "2026-08-01", effectiveTo: null },
        ],
        payBases: [
            { id: 21, ordinaryHourlyWage: 20000, effectiveFrom: "2026-08-01", effectiveTo: null },
        ],
    },
    {
        employeeId: 2,
        employeeName: "한소율",
        compensations: [
            {
                id: 2,
                employmentType: "REGULAR",
                salaryType: "MONTHLY",
                baseSalary: 3700000,
                hourlyWage: null,
                weeklyContractHours: 40,
                effectiveFrom: "2026-08-01",
                effectiveTo: null,
            },
        ],
        fixedAllowances: [],
        payBases: [
            { id: 22, ordinaryHourlyWage: 22000, effectiveFrom: "2026-08-01", effectiveTo: null },
        ],
    },
    {
        employeeId: 6,
        employeeName: "최지우",
        compensations: [
            {
                id: 6,
                employmentType: "PART_TIME",
                salaryType: "HOURLY",
                baseSalary: null,
                hourlyWage: 12000,
                weeklyContractHours: 15,
                effectiveFrom: "2026-08-01",
                effectiveTo: null,
            },
        ],
        fixedAllowances: [],
        payBases: [
            { id: 26, ordinaryHourlyWage: 12000, effectiveFrom: "2026-08-01", effectiveTo: null },
        ],
    },
];
