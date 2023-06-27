
export interface IName {
    firstName: string;
    lastName: string;
}
export type Division = "Open" | "Production" | "Standard" | "Classic";
export interface IShooter {
    name: IName;
    division: Division;
}

export type StageType = "Short" | "Medium" | "Long" | "Special" //1.2.1 https://www.ipsc.org/wp-content/uploads/2023/06/IPSC-Action-Air-Handgun-Rules-2023-HKG.pdf
//Special for over 32 rounds stage
export type Condition = 1 | 2 | 3