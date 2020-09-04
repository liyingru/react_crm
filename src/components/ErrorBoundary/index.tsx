import React from "react";
import { Result } from "antd";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // if (this.state.info && this.state.info.componentStack) {
    this.setState({
      hasError: true,
      error: error,
    });
    // }
  }

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      // You can render any custom fallback UI
      // const pathname = this.props.children?.props?.location?.pathname;
      return (
        <Result
          status="error"
          title="发生错误"
          subTitle={error?.message ?? "发生错误，请联系管理员。"}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
