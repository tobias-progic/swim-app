'use strict';

// var LeaderBoardHeader = React.createClass({
//     render: function () {
//         return (
//             <div className="LeaderBoardHeader">
//                 <h3>{this.props.date.toTimeString()}</h3>
//                 Place header elements &lt;HeaderElement&gt; here
//             </div>
//         )
//     }
// })

// ReactDOM.render(
//     <LeaderBoardHeader date={new Date()}/>,
//     document.getElementById('leaderboard')
// )

var TimespanCategoryRow = React.createClass({
  render: function() {
    return (<tr><th colSpan="2">{this.props.category}</th></tr>);
  }
});

var SwimmerRow = React.createClass({
  render: function() {
    var name = this.props.swimmer.finished ?
      this.props.swimmer.name :
      <span style={{color: 'red'}}>
        {this.props.swimmer.name}
      </span>;
    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.swimmer.time ? this.props.swimmer.time : 'dnf'}</td>
      </tr>
    );
  }
});

var SwimmerTable = React.createClass({
  render: function() {
    var rows = [];
    var lastCategory = null;
    this.props.swimmers.forEach(function(swimmer) {
      if (swimmer.category !== lastCategory) {
        rows.push(<TimespanCategoryRow category={swimmer.category} key={swimmer.category} />);
      }
      rows.push(<SwimmerRow swimmer={swimmer} key={swimmer.name} />);
      lastCategory = swimmer.category;
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});


var LeaderboardTable = React.createClass({
  render: function() {
    return (
        <SwimmerTable swimmers={this.props.swimmers} />
    );
  }
});


var SWIMMERS = [
  {category: 'Elite', name: 'Donald Duck', finished: true, time: '0:37:14'},
  {category: 'Elite', name: 'Clark Kent', finished: true, time: '0:59:42'},
  {category: 'Women', name: 'Joan Jett', finished: false},
  {category: 'Women', name: 'Janet Jackson', finished: true, time: '0:45:13'},
  {category: 'Amateur', name: 'Minnie Mouse', finished: false},
  {category: 'Amateur', name: 'Luke Skywalker', finished: true, time: '1:15:03'}
];

ReactDOM.render(
  <LeaderboardTable swimmers={SWIMMERS} />,
  document.getElementById('leaderboard')
);
