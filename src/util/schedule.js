export const weeklyDates = function* (days, start = new Date()) {
  const last = new Date(start.getTime());
  last.setMilliseconds(0);
  last.setSeconds(0);
  last.setMinutes(0);
  last.setHours(12);

  const fmt = (d) => new Date(d.getTime());
  // new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(d);
  // d.toISOString().split('T').shift();
  // [d.getFullYear(), d.getMonth(), d.getDate()].join('-');

  const ff = (day) => {
    last.setDate(last.getDate() + 1);
    while (last.getDay() != day) {
      last.setDate(last.getDate() + 1);
    }
  };

  let dayIdx = 0;

  while (true) {
    if (dayIdx >= days.length) {
      dayIdx = 0;
    }
    ff(days[dayIdx++]);
    yield fmt(last);
  }
};

export const defaultDateGenerator = () => {
  const gen = weeklyDates([5, 6]);

  return () => gen.next().value;
};

export const defaultScoreGenerator = () => null;

export const generateSchedule = (
  names,
  dateGenerator = defaultDateGenerator(),
  scoreGenerator = defaultScoreGenerator
) => {
  const games = names.reduce(
    (acc, cur) =>
      acc.concat(
        names.map((name) => name != cur && [name, cur]).filter((x) => !!x)
      ),
    []
  );

  const days = games.reduce((acc, cur) => {
    let day = acc.find((gs) =>
      gs.every((g) => !g.includes(cur[0]) && !g.includes(cur[1]))
    );
    if (!day) {
      day = [];
      acc.push(day);
    }
    day.push(cur);
    return acc;
  }, []);

  const schedule = days.map((day, idx) => {
    const date = dateGenerator(idx);

    return {
      date,
      games: day.map((game) => {
        const host = game[0];
        const guest = game[1];
        const score = scoreGenerator({ date, host, guest, idx });
        return {
          host,
          guest,
          score,
        };
      }),
    };
  });

  return schedule;
};
