// 部门销售目标(季度)
export interface StructureQuarterlySalesTarget {
  id: 1
  company_id: 7
  structure_id: 58
  month_1: string;
  month_2: string;
  month_3: string;
  month_4: string;
  month_5: string;
  month_6: string;
  month_7: string;
  month_8: string;
  month_9: string;
  month_10: string;
  month_11: string;
  month_12: string;
  year: string;
  create_time: string;
  update_time: null
  company_name: string;
  structure_name: string;
  quarter1: string;
  quarter2: string;
  quarter3: string;
  quarter4: string;
  quarter1_actual: string;
  quarter2_actual: string;
  quarter3_actual: string;
  quarter4_actual: string;
  quarter1_achieving: string;
  quarter2_achieving: string;
  quarter3_achieving: string;
  quarter4_achieving: string;
}

export interface StructureQuarterlySalesTargetModel {
  company_name: string;
  structure_list: [StructureQuarterlySalesTarget];
}

// 部门销售目标(月度)
export interface StructureMonthlySalesTarget {
  id: string;
  company_id: string;
  structure_id: string;
  month_1: string;
  month_2: string;
  month_3: string;
  month_4: string;
  month_5: string;
  month_6: string;
  month_7: string;
  month_8: string;
  month_9: string;
  month_10: string;
  month_11: string;
  month_12: string;
  year: string;
  create_time: string;
  update_time: string;
  company_name: string;
  structure_name: string;
  month_1_actual: string;
  month_2_actual: string;
  month_3_actual: string;
  month_4_actual: string;
  month_5_actual: string;
  month_6_actual: string;
  month_7_actual: string;
  month_8_actual: string;
  month_9_actual: string;
  month_10_actual: string;
  month_11_actual: string;
  month_12_actual: string;
  month_1_achieving: string;
  month_2_achieving: string;
  month_3_achieving: string;
  month_4_achieving: string;
  month_5_achieving: string;
  month_6_achieving: string;
  month_7_achieving: string;
  month_8_achieving: string;
  month_9_achieving: string;
  month_10_achieving: string;
  month_11_achieving: string;
  month_12_achieving: string;
}

export interface StructureMonthlySalesTargetModel {
  company_name: string;
  structure_list: [StructureMonthlySalesTarget];
}

// 员工销售目标（季度）
export interface EmployeeQuarterlySalesTarget {

}

export interface EmployeeQuarterlySalesTargetModel {
  company_name: string;
  structure_list: [StructureQuarterlySalesTarget];
}

// 员工销售目标（月度）
export interface EmployeeMonthlySalesTarget {

}

export interface EmployeeMonthlySalesTargetModel {
  company_name: string;
  structure_list: [StructureMonthlySalesTarget];
}
