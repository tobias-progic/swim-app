'use strict';


// Server: Bygg route för LeaderBoard
// Databas: Heat måste veta om det avslutats eller pågår
// Klient: Hårdkoda header i leaderboarden


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
      this.props.swimmer.firstname :
      <span style={{color: 'red'}}>
        {this.props.swimmer.firstname}
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
  loadLeaderboard: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log('received', data);
        this.setState({swimmers: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {swimmers: []};
  },
  componentDidMount: function() {
    this.loadLeaderboard();
    // setInterval(this.loadLeaderboard, this.props.interval);
  },
  render: function() {
    var rows = [];
    var lastCategory = null;
    this.state.swimmers.forEach(function(swimmer) {
      // if (swimmer.category !== lastCategory) {
      //   rows.push(<TimespanCategoryRow category={swimmer.heatNbr} key={swimmer.heatNbr} />);
      // }
      rows.push(<SwimmerRow swimmer={swimmer} key={swimmer.id} />);
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
        // <SwimmerTable swimmers={this.props.swimmers} />
        <SwimmerTable url={this.props.url} interval={this.props.interval}/>
    );
  }
});

ReactDOM.render(
  <LeaderboardTable url='/api/1/participants' interval='5000'/>,
  document.getElementById('leaderboard')
);

// var SWIMMERS = [
//   {category: 'Elite', name: 'Donald Duck', finished: true, time: '0:37:14'},
//   {category: 'Elite', name: 'Clark Kent', finished: true, time: '0:59:42'},
//   {category: 'Women', name: 'Joan Jett', finished: false},
//   {category: 'Women', name: 'Janet Jackson', finished: true, time: '0:45:13'},
//   {category: 'Amateur', name: 'Minnie Mouse', finished: false},
//   {category: 'Amateur', name: 'Luke Skywalker', finished: true, time: '1:15:03'}
// ];

// ReactDOM.render(
//   <LeaderboardTable swimmers={SWIMMERS} url='/api/1/paricipants' />,
//   document.getElementById('leaderboard')
// );
