import { TPostId } from "./posts";

export interface ILikeState {
  userLike: boolean;
  postId: TPostId;
  postCategory: TPostCategory;
}

export interface ILikeAction {
  userLike: boolean;
  postId: TPostId;
  postCategory: TPostCategory;
}

export interface ILikeToggle {
  postId: TPostId;
  postCategory: TPostCategory;
}

export type TPostCategory = "FREE" | "VIDEO" | "DANCER" | "";
