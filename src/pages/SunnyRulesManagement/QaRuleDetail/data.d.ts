
export interface RulesDetail {
    id: number;
    status: 1 | 2;
    desc: string;
    name: string;
    content: {
        company_id: string,
        channel: string,
        category: string,
    }[];
    create_by: number;
    update_by: number;
    create_time: string;
    update_time: string;
}
