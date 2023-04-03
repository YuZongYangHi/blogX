import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
import {Space} from "antd";

const copyRight = () => {
  const currentYear = new Date().getFullYear();
  return (
    <Space>
      {currentYear} FANTASY
      <span>
        ICP：
        <a href="https://beian.miit.gov.cn/" target="_blank">黑ICP备2022001949号-1</a>
      </span>

    </Space>
  )
}
const Footer: React.FC = () => {

  return (
    <DefaultFooter
      copyright={copyRight()}
      links={[
        {
          key: 'CSDN',
          title: 'CSDN',
          href: 'https://blog.csdn.net/yyy72999/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/YuZongYangHi',
          blankTarget: true,
        }
      ]}
    />
  );
};

export default Footer;
