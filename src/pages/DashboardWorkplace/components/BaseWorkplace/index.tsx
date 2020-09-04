import { Component } from "react";
import { SystemUser } from "../../data";

export interface BaseWorkplaceState {
  bIndex?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  userListSelectedValue: string;
  userListDisabled: boolean;
}

export interface BaseWorkplaceProps {
  showOnlySelf: boolean;
  userList: SystemUser[];
  loading: boolean;
  onChange?: (type: number, value: string) => void;
  justLookAtMe?: (type: number, checked: boolean) => void;
}

class BaseWorkplace<P, S> extends Component<BaseWorkplaceProps, BaseWorkplaceState> {
  constructor(props: BaseWorkplaceProps) {
    super(props);
    this.state = {
      userListSelectedValue: '',
      userListDisabled: false
    }
  }

  public onJustLookAtMeCheckboxChange = (e) => {
    const { justLookAtMe } = this.props;
    const { bIndex } = this.state;
    bIndex && justLookAtMe && justLookAtMe(bIndex, e.target.checked);
    if (e.target.checked) {
      this.setState({
        userListSelectedValue: '',
        userListDisabled: true
      });
    } else {
      this.setState({
        userListSelectedValue: '',
        userListDisabled: false
      });
    }
  }
}

export default BaseWorkplace;
