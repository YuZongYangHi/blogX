import React from 'react';
import { Select } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

export default class CommonRemoteSelect extends React.Component {
  // arguments:
  /*
    ; request / 查询的地址
    ; select prompt / 下拉框提示
    ; mode: 多选/单选
    ;
  */
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchContent = debounce(this.fetchContent, 800);
  }
  state = {
    data: [],
    value: [],
    fetching: false,
    global: false,
  };

  fetchContent = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;

    this.setState({ data: [], fetching: true });
    const params = {
      name: value,
    };
    if (this.props.searchKey) {
      delete params['name'];
      params[this.props.searchKey] = value;
    }
    this.props
      .request(params)
      .then((res) => {
        if (res.data.code === 200) {
          if (fetchId !== this.lastFetchId) {
            return;
          }
          const data = res.data.data.map((d) => ({
            key: this.props.searchKey && this.props.admin ? d.user_id : d.id,
            value: this.props.searchKey ? d[this.props.searchKey] : d.name,
          }));

          this.setState({
            data: data,
          });
        }
      })
      .catch((error) => {
        this.setState({ data: [], fetching: false });
      });
  };

  handleChange = (value) => {
    this.setState({
      value,
      data: [],
      fetching: false,
      global: true,
    });
  };

  handleSelect = (value) => {
    const { onChange } = this.props;
    onChange(value.key);
  };

  componentDidUpdate() {
    // 判断onChange的值如果是空了, 我们需要把当前的value的state状态置为空
    if (this.props.value === undefined && this.state.value.key) {
      this.setState({
        value: {
          key: '',
          label: '',
        },
        global: false,
      });
    }
  }

  render() {
    const { fetching, data, value } = this.state;
    let defaultValue =
      this.state.global === true && this.props.value === value.key
        ? value
        : this.props.selectDefaultValue
        ? this.props.selectDefaultValue
        : value;

    defaultValue = this.props.value ? defaultValue : { key: '', label: '' };
    const key = this.props.key ? this.props.key : 1;

    return (
      <Select
        filterOption={false}
        key={key}
        labelInValue
        mode={this.props.mode}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        onChange={this.handleChange}
        onSearch={this.fetchContent}
        onSelect={(value) => this.handleSelect(value)}
        placeholder={this.props.prompt}
        showSearch
        style={{ width: '100%' }}
        value={defaultValue}
        //  allowClear={true}
      >
        {data.map((d) => (
          <Option key={d.key} value={d.key}>
            {d.value}
          </Option>
        ))}
      </Select>
    );
  }
}
