import 'braft-editor/dist/output.css'
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import React from 'react';
import {ArticleDetailRequest} from '../../services/article/article'
import { SpinLoading, AutoCenter, Divider } from 'antd-mobile'
import moment from "moment";

export default class Article extends React.Component {

    state = {
        data: null,
        articleId: 0,
        code: ""
    }

    componentWillMount() {
        try {
            const articleId = window.location.pathname.split("/")[5];
            this.setState({articleId: articleId})
        }catch (error) {
            window.location.href = "/"
        }
    }

    componentDidMount = async ()  => {
        const {articleId} = this.state;
        try {
            const result = await ArticleDetailRequest(articleId);
            this.setState({
                data: result.data.list
            })
            this.highlightCodeInHTML(result.data.list)
        }catch (error) {
            console.log(error)
        }
    }


    highlightCodeInHTML = (data: object) => {
        if (this.state.data) {
            const container = document.createElement("div");
            container.innerHTML = data.content.replace(/<br\s*\/?>/g,'\n');
            container.code = data.content.replace(/^(?:\r?\n|\r)/,'');
            Prism.highlightAllUnder(container);
            this.setState({
                code: container.innerHTML
            })
            return container.innerHTML;
        }

        return ""
    }


    render() {
        const {data} = this.state;
        return (
            <div style={{marginTop: 24}}>
                { !data  && <SpinLoading style={{ '--size': '48px', margin: "0 auto" }} /> ||
                <>
                    <AutoCenter><h2>{data.title}</h2></AutoCenter>
                    <AutoCenter >{moment(data.created).format('YYYY-MM-DD HH:mm')}</AutoCenter>

                    <Divider/>

                    <div className="braft-output-content" dangerouslySetInnerHTML={{__html: this.state.code}} style={{padding: 8}} />
                </>
                }
            </div>
        );
    }
}