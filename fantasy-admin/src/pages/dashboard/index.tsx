import React from 'react';
import ArticleDashboard from './article'
import UserDashboard from './user'
import ArticleReleaseTrend from './articleReleaseTrend/'
import UserLoginTrend from './userLoginTrend'

export default class Dashboard extends React.Component<any, any> {
  render() {
    return (
      <div>
        <ArticleDashboard/>
        <UserDashboard/>
        <ArticleReleaseTrend/>
        <UserLoginTrend/>
      </div>

    )
  }
}
