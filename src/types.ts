export interface IName {
    firstName: string;
    lastName: string;
}
export type Division = "Open" | "Production" | "Standard" | "Classic";
export interface IShooter {
    name: IName;
    division: Division;
}
