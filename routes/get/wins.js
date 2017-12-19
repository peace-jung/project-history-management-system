module.exports = (req, res) => {
  let myWins = [];
  let sql = '';

  if (user.user_type == "S") {
    sql = `SELECT DISTINCT wins_view.project_number, projects.title AS pt, wins_view.title AS wt, wins_view.wins_type, wins_view.date
        FROM wins_view, projects,
        (
          SELECT DISTINCT ProjectWins.project_number
            FROM ProjectWins
            JOIN TeamMembers ON ProjectWins.project_number = TeamMembers.project_number
            WHERE id LIKE '${user.id}'
        ) AS myproject
        WHERE wins_view.project_number =  projects.project_number
          AND myproject.project_number = wins_view.project_number
        ORDER BY wins_view.date`;
    connection.query(sql, function (err, result) {
      if (err) console.log('목록 조회 실패', err);
      console.log('목록 조회 성공');
      myWins = result;
    });
  }
  sql = `SELECT DISTINCT wins_view.project_number, projects.title AS pt, wins_view.title AS wt, wins_view.wins_type, wins_view.date
        FROM wins_view, projects
        WHERE wins_view.project_number =  projects.project_number
        ORDER BY wins_view.date`;
  connection.query(sql, function (err, result) {
    if (err) console.log('목록 조회 실패', err);
    console.log('목록 조회 성공');

    res.render('wins', { user: user, list: result, myWins: myWins });
  });
}