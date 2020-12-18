export class GeneralMeetingNight {
    public id: string;
    public meetingDate: string;
    public facilitator: string;
    public meetingType: string;
    public supportRole: string;
    public title: string;
    public worship: string;
    public avContact: string;
    public attendance: number;
    public newcomers: number;
    public donations: number;
    public meal: string;
    public mealCoordinator: string;
    public mealCnt: number;
    public cafeCoordinator: string;
    public cafeCount: number;
    public greeterContact1: string;
    public greeterContact2: string;
    public resourceContact: string;
    public announcementsContact: string;
    public closingContact: string;
    public securityContact: string;
    public setupContact: string;
    public cleanupContact: string;
    public transportationContact: string;
    public transportationCount: number;
    public nurseryContact: string;
    public nursery: number;
    public childrenContact: string;
    public children: number;
    public youthContact: string;
    public youth: number;
    public notes: string;
    constructor() {
        this.id = '';
        this.meetingDate = '';
        this.facilitator = '';
        this.meetingType = '';
        this.supportRole = '';
        this.title = '';
        this.worship = '';
        this.avContact = '';
        this.attendance = 0;
        this.newcomers = 0;
        this.donations = 0;
        this.meal = '';
        this.mealCoordinator = '';
        this.mealCnt = 0;
        this.cafeCoordinator = '';
        this.cafeCount = 0;
        this.greeterContact1 = '';
        this.greeterContact2 = '';
        this.resourceContact = '';
        this.announcementsContact = '';
        this.closingContact = '';
        this.securityContact = '';
        this.setupContact = '';
        this.cleanupContact = '';
        this.transportationContact = '';
        this.transportationCount = 0;
        this.nurseryContact = '';
        this.nursery = 0;
        this.childrenContact = '';
        this.children = 0;
        this.youthContact = '';
        this.youth = 0;
        this.notes = '';
    }
}
