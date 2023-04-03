import React from 'react';
import { Transfer, Button } from 'antd';

export default class RemoteTransfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mockData: [],
      targetKeys: [],
      lastData: null,
    };
  }
  componentDidMount() {
    this.sourceData = this.props.anydata;
    this.getMock();
  }

  componentDidUpdate() {
    if (this.props.value !== this.state.lastData) {
      this.setState({
        targetKeys: this.props.value,
        lastData: this.props.value,
      });
    }
  }
  getMock = () => {
    // 选中的数据
    const targetKeys = [];

    // 未选中的数据
    const mockData = [];

    for (var i in this.sourceData) {
      const data = {
        key: this.sourceData[i].id,
        title: this.sourceData[i].name,
        description: this.sourceData[i].description,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    this.setState({ mockData, targetKeys });
  };

  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
    const { onChange } = this.props;
    onChange(targetKeys);
  };

  renderFooter = () => (
    <Button disabled onClick={this.getMock} size="small" style={{ float: 'right', margin: 5 }}>
      reload
    </Button>
  );

  render() {
    return (
      <Transfer
        dataSource={this.state.mockData}
        footer={this.renderFooter}
        listStyle={{
          width: 230,
          height: 300,
        }}
        onChange={this.handleChange}
        operations={['新增', '删除']}
        render={(item) => `${item.title}`}
        showSearch
        targetKeys={this.state.targetKeys}
      />
    );
  }
}
