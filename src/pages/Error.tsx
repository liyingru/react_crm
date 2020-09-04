
import { Button, Result, Descriptions } from 'antd';
import router from 'umi/router';

const ErrorPage: React.FC<{}> = (props) => {
  try {
    let errorMessage = props?.location?.query?.m ?? "未知";
    console.log("错误信息：", errorMessage);
    return (
      <Result
        status="error"
        title="抱歉，出错了！"
        subTitle="请联系管理员"
        extra={[
          <Descriptions title="错误详情">
            <Descriptions.Item label="错误信息">{errorMessage}</Descriptions.Item>
          </Descriptions>,
          <Button type="primary" onClick={() => router.push('/')}>返回首页</Button>
        ]}
      ></Result >
    )
  }
  catch {
    return (
      <Result
        status="error"
        title="抱歉，出错了！"
        subTitle="请联系管理员"
        extra={<Button type="primary" onClick={() => router.push('/')}>返回首页</Button>}
      ></Result >
    )
  }
};

export default ErrorPage;
