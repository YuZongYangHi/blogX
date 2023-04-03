import './index.less'
import React from 'react';
import {Swiper, DotLoading} from 'antd-mobile';
import {ArticleTopListRequest} from '../../services/article/article'

const styles = {
    height: 120,
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 48,
    userSelect: "none",
    background: "#bcffbd",
    marginTop: 8,
    marginBottom: 8,
    cursor: "pointer"

}
export default class TopArticle extends React.Component {

    state = {
        data: []
    }

    componentDidMount = async () => {
        const result = await ArticleTopListRequest();
        if (result.success) {
            this.setState({
                data: result.data.list
            })
        }
    }

    handlerRedirectArticle = (item: any) => {
        window.location.href = `/h5/category/${item.category}/article/${item.id}`
    }

    render() {
        const {data} = this.state;
        return (
            <div>
                {data.length === 0 &&

                    <span style={{ fontSize: 24 }}>
                        <DotLoading />
                    </span>
                    ||
                    <Swiper autoplay>{
                        data.length >0 && data.map(item => (
                            <Swiper.Item key={item.id}>
                                <div style={styles}>
                                    <img key={item.image} onClick={()=>{this.handlerRedirectArticle(item)}} src={item.image} alt={""}/>
                                </div>
                            </Swiper.Item>
                        ))
                    }
                    </Swiper>
                }
            </div>
        );
    }
}