import { Pagination } from "@/commondata";

/** 话术分类 */
export interface CategoryItem {
  id: number,
  name: string,
  count: string,
  scene: string,
}

export interface ColloquialismListItem {
  id: number,
  title: string,
  /** 相似话术 数组 */
  equals: string[],
  /** 关键词 数组 */
  keyword: string[],
  /** 标准答案 数组 */
  answer: string[],
  /** 所属分类id */
  category_id: number,
  /** 所属分类 */
  category_name: string,
  create_time: string,
  update_time: string,
  start_time: string,
  /**状态，1：开启  2：停用 */
  status: 1 | 2
}

export interface ColloquialismListData {
  list: ColloquialismListItem[];
  pagination: Partial<Pagination>;
}

