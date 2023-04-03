import React from 'react';
import {ArticleCategoryListRequest} from '../../services/category/index'
import {ArticleListRequest} from '../../services/article/article'
import {SpinLoading, Image, List, Empty, Card} from 'antd-mobile'

export default class Category extends React.Component {

    state = {
        categoryList: [],
        category: "",
        once: false,
        articleList: []
    }

    componentWillMount() {
        try{
            const router = window.location.pathname;
            const activeKey = router.split("/")[3];
            this.setState({
                category: activeKey
            })
        }catch (err) {
            console.log(err)
        }
    }

    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        if (!prevState.category) {
            this.setState({
                category: this.state.categoryList[0].name
            })
        }

        if (this.state.category && !this.state.once ) {
            try{
                const result = await ArticleListRequest(this.state.category)
                this.setState({
                    once: true,
                    articleList: result.data.list
                })
            }catch (err) {
            }
        }
    }

    componentDidMount = async () => {
        try {
            const result = await ArticleCategoryListRequest();
            const data = result.data.list;

            this.setState({
                categoryList: data,
            })
        }catch (err) {
            console.log(err)
        }
    }

    handlerRedirectArticle = (item) => {
        window.location.href = `/h5/category/${item.category.name}/article/${item.Id}`
    }

    render() {
        const { articleList} = this.state;
        return (
            <div style={{marginTop: 16}}>
                {
                    !articleList &&
                    <Card >
                        <Empty description='暂无数据' />

                    </Card>
                    ||  articleList.length === 0 &&  <SpinLoading style={{ '--size': '32px', margin: "0 auto" }} /> || <List header='文章列表'>
                        {articleList.map(item => (
                            <List.Item
                                style={{cursor: "pointer"}}
                                onClick={()=>{this.handlerRedirectArticle(item)}}
                                key={item.Id}
                                prefix={
                                    <Image
                                        src={item.image}
                                        //style={{ borderRadius: 20 }}
                                        fit='cover'
                                        width={40}
                                        height={40}
                                    />
                                }
                                description={`${item.content.replace(/<\/?.+?>/g,"").replace(/ /g,"").slice(0, 100)}.....`}
                            >
                                {item.title}
                            </List.Item>
                        ))}
                    </List>
                }

            </div>
        );
    }
}