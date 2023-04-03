import React from 'react';
import Header from './components/header';
import Article from './pages/article'
import Category from './pages/category'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopArticle from './pages/swiper'

export default class Entrance extends React.Component {

    render() {
        return (
            <div>
                <Header/>
                <TopArticle/>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Category/>} path="/h5"/>
                        <Route element={<Category/>} path="/h5/category/:name"/>
                        <Route element={<Article/>} path="/h5/category/:categoryName/article/:articleId"/>
                    </Routes>
                </BrowserRouter>
            </div>
        )
    }
}