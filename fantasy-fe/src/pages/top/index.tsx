import "@/pages/top/index.css"
import React from 'react'
import { Carousel } from 'antd';
import ProCard from '@ant-design/pro-card';
import {ArticleTopListRequest} from '@/services/article/article'

export default class ArticleTopCarousel extends React.Component<any, any> {

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
    console.log(item)
    window.location.href = `/category/${item.category}/article/${item.id}`
  }

  render() {
    const {data} = this.state;

    return (
      <ProCard ghost gutter={16} style={{overflow: "hidden"}} >
        <Carousel autoplay>
          {
            data.length >0 && data.map(item => (
              <div key={item.id}>
                <img key={item.image} onClick={()=>{this.handlerRedirectArticle(item)}} className={"carousel_img"} src={item.image} alt={""}/>
              </div>
            ))
          }
        </Carousel>
      </ProCard>
    );
  }
}
