import React from 'react';
import { Tabs, DotLoading } from 'antd-mobile';
import { AntOutline } from 'antd-mobile-icons'
import {ArticleCategoryListRequest} from '../../services/category/index'

export default class Header extends React.Component {

    state = {
        category: [],
        activeKey: "",
    };

    componentWillMount() {
        try{
            const router = window.location.pathname;
            const activeKey = router.split("/")[3];
            this.setState({
                activeKey: activeKey
            })
        }catch (err) {
            console.log(err)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevState.activeKey) {
            this.setState({
                activeKey: this.state.category[0].name
            })
        }
    }

    componentDidMount = async () => {
        try {
            const result = await ArticleCategoryListRequest();
            const data = result.data.list;
            this.setState({
                category: data,
            })
        }catch (err) {
            console.log(err)
        }
    }

    handleOnChangeKey = (activeKey) => {
       window.location.href = `/h5/category/${activeKey}`
    }

    render() {
        const {category, activeKey} = this.state;
        return (
            <div>
                {
                    !category && !activeKey  && <DotLoading color='primary' />
                    ||
                    <>
                        <div style={{fontSize: 34, float: "left", marginRight: 8}}>
                            <AntOutline  color='#76c6b8' />
                        </div>
                    <Tabs activeKey={activeKey} onChange={this.handleOnChangeKey}>
                        {category.map(item=> (<Tabs.Tab title={item.name} key={item.name} disabled={item.id === 0} ></Tabs.Tab>))}
                    </Tabs>
                    </>
                }

            </div>
        );
    }
}
