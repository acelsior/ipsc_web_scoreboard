export interface IName {
    firstName: string;
    lastName: string;
}
export type Division = "Open" | "Production" | "Standard" | "Classic";
export interface IShooter {
    name: IName;
    division: Division;
}

export type StageType = "Short" | "Medium" | "Long" | "Special"; //1.2.1 https://www.ipsc.org/wp-content/uploads/2023/06/IPSC-Action-Air-Handgun-Rules-2023-HKG.pdf
//Special for over 32 rounds stage
export type Condition = 1 | 2 | 3;

export enum ProceduralErrorEnum {
    "10.2.1 Shooting beyond the fault line", //maximum 1
    "10.2.1.1 Shooting beyond the fault line(per shoot)", //maximum unlimited
    "10.2.2 Fails to comply the procedure specified in the written stage briefing",
    "10.2.2 Fails to comply the procedure specified in the written stage briefing(per shoot)",
    "10.2.4 Fails to reload", //per shoot until reload
    "10.2.5 Cooper tunnel",
    "10.2.6 Any movement between standby signal and start signal",
    "10.2.7 Fail to engage target", //pro + miss
    "10.2.8 (StrongWeak hand only/Weak hand only) touching the handgun with the other hand",
    "10.2.8.2 (StrongWeak hand only/Weak hand only) use props to increase stability",
    "10.2.11 Shoots over barrier that over 1.8m tall",
}

export type ProceduralErrorTypes =
    | "10.2.1 Shooting beyond the fault line"
    | "10.2.1.1 Shooting beyond the fault line(per shoot)"
    | "10.2.2 Fails to comply the procedure specified in the written stage briefing"
    | "10.2.2 Fails to comply the procedure specified in the written stage briefing(per shoot)"
    | "10.2.4 Fails to reload"
    | "10.2.5 Cooper tunnel"
    | "10.2.6 Any movement between standby signal and start signal"
    | "10.2.7 Fail to engage target"
    | "10.2.8 (StrongWeak hand only/Weak hand only) touching the handgun with the other hand"
    | "10.2.8.2 (StrongWeak hand only/Weak hand only) use props to increase stability"
    | "10.2.11 Shoots over barrier that over 1.8m tall";

export class ProceduralError {
    index = ""; //index in rulebook
    title: ProceduralErrorTypes = "10.2.1 Shooting beyond the fault line";
    description = "";
    max = -1;
    min = 0;
    currentCount = 0;
}

export class ShootBeyondTheFaultLine extends ProceduralError {
    index = "10.2.1";
    title: ProceduralErrorTypes = "10.2.1 Shooting beyond the fault line";
    description =
        "10.2.1 A competitor who fires shots while any part of their body is touching the ground or any object beyond a Fault Line will receive 1 procedural penalty for each occurrence. No penalty is assessed if a competitor does not fire any shots while faulting except when Rule 2.2.1.5 applies.\n" +
        "10.2.1 如參賽者於射擊時身體任何部份接觸限制超越線以外的地面或任何物品，每次判罰一個程序性犯規。如參賽者觸犯上述情況但沒有射擊，不可判罰程序性犯規，引用賽例 2.2.1.5 時除外。";
    max = 1;
    min = 0;
}

export class ShootBeyondTheFaultLinePerShoot extends ProceduralError {
    index = "10.2.1.1";
    title: ProceduralErrorTypes =
        "10.2.1.1 Shooting beyond the fault line(per shoot)";
    description =
        "10.2.1.1 However, if the competitor has gained a significant advantage on any target(s) while faulting, he may instead be assessed 1 procedural penalty for each shot fired at the subject target(s) while faulting.\n" +
        "10.2.1.1 然而，如參賽者因此犯規行為射擊標靶而獲得顯著的競賽優勢，可以每次違規射擊上述標靶判罰一個程序性犯規。";
    max = -1;
    min = 0;
}

export class FailsToComplyProcedure extends ProceduralError {
    index = "10.2.2";
    title: ProceduralErrorTypes =
        "10.2.2 Fails to comply the procedure specified in the written stage briefing";
    description =
        "10.2.2 A competitor who fails to comply with a procedure specified in the written stage briefing will incur 1 procedural penalty for each occurrence. However, if a competitor has gained a significant advantage during non-compliance, the competitor may be assessed 1 procedural penalty for each shot fired, instead of a single penalty (e.g. firing one or more shots contrary to the required location, shooting position or stance).\n" +
        "10.2.2 如參賽者不能符合書面賽程簡報上列明的指定動作，每次犯規判罰一個程序性犯規。然而，如參賽者因此犯規行為而獲得顯著的競賽優勢，每次射擊判罰一個程序性犯規，代替一次性判罰(例如：未有依照賽程簡報在指定地方、位置或姿勢射擊。)。";
    max = 1;
    min = 0;
}

export class FailsToComplyProcedurePerShoot extends ProceduralError {
    index = "10.2.2";
    title: ProceduralErrorTypes =
        "10.2.2 Fails to comply the procedure specified in the written stage briefing(per shoot)";
    description =
        "10.2.2 A competitor who fails to comply with a procedure specified in the written stage briefing will incur 1 procedural penalty for each occurrence. However, if a competitor has gained a significant advantage during non-compliance, the competitor may be assessed 1 procedural penalty for each shot fired, instead of a single penalty (e.g. firing one or more shots contrary to the required location, shooting position or stance).\n" +
        "10.2.2 如參賽者不能符合書面賽程簡報上列明的指定動作，每次犯規判罰一個程序性犯規。然而，如參賽者因此犯規行為而獲得顯著的競賽優勢，每次射擊判罰一個程序性犯規，代替一次性判罰(例如：未有依照賽程簡報在指定地方、位置或姿勢射擊。)。";
    max = -1;
    min = 0;
}
export class FailsToReload extends ProceduralError {
    index = "10.2.4";
    title: ProceduralErrorTypes = "10.2.4 Fails to reload";
    description =
        "10.2.4 A competitor who fails to comply with a mandatory reload will incur 1 procedural penalty for each shot fired after the point where the reload was required until a reload is performed. 10.2.4 如參賽者沒有覆行指定的換匣動作，之後的每次射擊判罰一個程序性犯規，直至更換彈匣為止。";
    max = -1;
    min = 0;
}

export class CooperTunnel extends ProceduralError {
    index = "10.2.5";
    title: ProceduralErrorTypes = "10.2.5 Cooper tunnel";
    description =
        "10.2.5 In a Cooper Tunnel, a competitor who disturbs one or more pieces of the overhead material will receive 1 procedural penalty for each piece of overhead material which falls. Overhead material which falls as a result of the competitor bumping or striking the uprights, or as a result of muzzle gases or recoil, will not be penalized.\n" +
        "10.2.5 在’礦工隧道’中，如參賽者碰撞上方一件或多件物料並導致物料掉落，每件掉落物料判罰一個程序性犯規。如參賽者碰撞支架，或因鎗口氣體或滑架回膛而令上方物料掉落，不會判罰程序性犯規。";
    max = -1;
    min = 0;
}

export class MoveBeforeStart extends ProceduralError {
    index = "10.2.6";
    title: ProceduralErrorTypes =
        "10.2.6 Any movement between standby signal and start signal";
    description =
        '10.2.6 A competitor who is creeping (e.g. moving hands towards the firearm, a reloading device or projectile) or physically moving to a more advantageous shooting position or stance after the "Standby" command and prior to issuance of the Start Signal, will incur 1 procedural penalty. If the Range Officer can stop the competitor in time, a warning will be issued for the first offense and the competitor will be restarted.\n' +
        "10.2.6 如參賽者在’Standby’ 口令與開始訊號之間做出偷步動作(例如：手郁動至鎗枝，換匣裝置或投射物)或實際移動至任何有利射擊位置，判罰一個程序性犯規。如 RO 能及時停止參賽者，第一次干犯判罰警告及指令參賽者重新開始。";
    max = 1;
    min = 0;
}

export class FailToEngageTarget extends ProceduralError {
    index = "10.2.7";
    title: ProceduralErrorTypes = "10.2.7 Fail to engage target";
    description =
        "10.2.7 A competitor who fails to engage any scoring target with at least one projectile will incur 1 procedural penalty per target, plus the applicable number of misses, except where the provisions of Rule 9.9.2 apply.\n" +
        "10.2.7 如參賽者沒有射擊任何計分標靶最少一鎗，每個標靶判罰一個程序性犯規，再加應有的Miss 判罰，賽例 9.9.2 規定情況除外。";
    max = -1;
    min = 0;
}

export class SHOWHOTouchingTheHandgunWithOtherHand extends ProceduralError {
    index = "10.2.8";
    title: ProceduralErrorTypes =
        "10.2.8 (StrongWeak hand only/Weak hand only) touching the handgun with the other hand";
    description =
        '10.2.8 If a course of fire (or part thereof) stipulates shooting strong or weak hand only, a competitor will incur one procedural penalty for each occurrence of touching the handgun (or scooping it from a table etc.) with the other hand after the Start Signal (or from the point where single hand shooting has been stipulated). Exceptions are releasing an external safety (without scooping), reloading or correcting a malfunction. However, the procedural penalty will be applied on a "per shot fired" basis when a competitor uses the other hand or arm to.\n' +
        "10.2.8 如賽程(或其中一部份)指定使用強或弱手射擊，參賽者於開始訊號後(或於某一位置指定使用單手射擊後)使用另一隻手接觸鎗枝(或在枱上挑起鎗枝等。)，每次判罰一個程序性犯規。在開啟外置安全掣(不在挑起鎗枝時)，換匣或維修失靈鎗枝可以豁免判罰。然而，參賽者使用另一隻手作出以下情況，判罰以”每發” 計算的程序性犯規：";
    max = -1;
    min = 0;
}

export class SHOWHOUsePropToIncreaseStability extends ProceduralError {
    index = "10.2.8.2";
    title: ProceduralErrorTypes =
        "10.2.8.2 (StrongWeak hand only/Weak hand only) use props to increase stability";
    description =
        "10.2.8.2 increase stability on the ground, a barricade or another prop while firing shots.\n" +
        "10.2.8.2 當射擊時，以地面，屏障或其他平台增加穩定性。";
    max = -1;
    min = 0;
}

export class ShootOverHighBarrier extends ProceduralError {
    index = "10.2.11";
    title: ProceduralErrorTypes =
        "10.2.11 Shoots over barrier that over 1.8m tall";
    description =
        "10.2.11 A competitor who fires shots over a barrier constructed to a height of at least 1.8 meters will incur 1 procedural penalty for each shot fired (also see Rule 2.2.3.1).\n" +
        "10.2.11 如參賽者在 1.8 米的障礙物之上射擊，判罰每鎗一個程序性犯規(見賽例 2.2.3.1)。";
    max = -1;
    min = 0;
}

export const ProceduralErrorObjectList = [
    new ShootBeyondTheFaultLine(),
    new ShootBeyondTheFaultLinePerShoot(),
    new FailsToComplyProcedure(),
    new FailsToComplyProcedurePerShoot(),
    new FailsToReload(),
    new CooperTunnel(),
    new MoveBeforeStart(),
    new FailToEngageTarget(),
    new SHOWHOTouchingTheHandgunWithOtherHand(),
    new SHOWHOUsePropToIncreaseStability(),
    new ShootOverHighBarrier(),
];
export const ProceduralErrorList = [
    ShootBeyondTheFaultLine,
    ShootBeyondTheFaultLinePerShoot,
    FailsToComplyProcedure,
    FailsToComplyProcedurePerShoot,
    FailsToReload,
    CooperTunnel,
    MoveBeforeStart,
    FailToEngageTarget,
    SHOWHOTouchingTheHandgunWithOtherHand,
    SHOWHOUsePropToIncreaseStability,
    ShootOverHighBarrier,
];
