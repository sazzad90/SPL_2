import React from 'react'

const CreateFixture = () => {
  //   const  createFixture =(startDate, endDate, numTeams, teamNames, numGroups, offDays)=> {

  // Validate input parameters

  if (numTeams < 2) {
    console.log('Error: At least two teams are required to create a fixture.');
    return;

  }

  if (numGroups < 1 || numGroups > numTeams) {
    console.log('Error: Invalid number of groups.');

    return;

  }

  if (teamNames.length !== numTeams) {

    console.log(teamNames.length);

    console.log('Error: Number of team names does not match the number of teams.');

    return;

  }



  // Calculate number of matches

  const numMatches = (numTeams * (numTeams - 1)) / 2;



  // Calculate number of matches per group

  const matchesPerGroup = numMatches / numGroups;



  // Create a list of match days

  const matchDays = [];

  const numMatchDays = Math.ceil(numMatches / (numTeams / 2));

  let matchDay = new Date(startDate);

  for (let i = 0; i < numMatchDays; i++) {

    if (offDays.includes(matchDay.getDay()) || offDates.includes(matchDay.getDate())) {

      i--;

    } else {

      matchDays.push(matchDay);

    }

    matchDay = new Date(matchDay.getTime() + 24 * 60 * 60 * 1000);

    if (matchDay >= new Date(endDate)) {

      break;

    }

  }



  // Shuffle the list of team names

  const shuffledTeamNames = shuffle(teamNames);



  // Divide the teams into groups

  const teamsPerGroup = Math.floor(numTeams / numGroups);

  const remainingTeams = numTeams % numGroups;

  let teamIndex = 0;

  const groups = [];

  for (let i = 0; i < numGroups; i++) {

    const group = [];

    for (let j = 0; j < teamsPerGroup; j++) {

      group.push(shuffledTeamNames[teamIndex]);

      teamIndex++;

    }

    if (remainingTeams > 0) {

      group.push(shuffledTeamNames[teamIndex]);

      teamIndex++;

      remainingTeams--;

    }

    groups.push(group);

  }



  // Create the group stage matches

  const groupMatches = [];

  matchDay = new Date(startDate);

  const matchesPerDay = new Map();



  for (let i = 0; i < numGroups; i++) {

    const group = groups[i];



    // Create a map to keep track of the last match day of each team

    const lastMatchDays = new Map();





    for (let j = 0; j < group.length - 1; j++) {

      for (let k = j + 1; k < group.length; k++) {

        const homeTeam = group[j];

        const awayTeam = group[k];



        // Get the last match day for the home team

        const homeLastMatchDay = lastMatchDays.get(homeTeam) || 0;



        // Get the last match day for the away team

        const awayLastMatchDay = lastMatchDays.get(awayTeam) || 0;



        let homeDiffTime = Math.abs(homeLastMatchDay - matchDay);

        let homeDiffDays = Math.ceil(homeDiffTime / (1000 * 60 * 60 * 24));



        let awayDiffTime = Math.abs(awayLastMatchDay - matchDay);

        let awayDiffDays = Math.ceil(awayDiffTime / (1000 * 60 * 60 * 24));





        // Find a match day that is at least 2 days after the last match day of both teams

        let count = 0;



        do {



          matchDay = matchDays[Math.floor(Math.random() * matchDays.length)];

          homeDiffTime = Math.abs(homeLastMatchDay - matchDay);

          homeDiffDays = Math.ceil(homeDiffTime / (1000 * 60 * 60 * 24));



          awayDiffTime = Math.abs(awayLastMatchDay - matchDay);

          awayDiffDays = Math.ceil(awayDiffTime / (1000 * 60 * 60 * 24));









        } while ((homeDiffDays < 3 && awayDiffDays < 3));








        groupMatches.push({

          homeTeam: homeTeam,

          awayTeam: awayTeam,

          group: i + 1,

          matchDay: matchDay

        });

        lastMatchDays.set(homeTeam, matchDay);

        lastMatchDays.set(awayTeam, matchDay);

      }

    }

  }

  //matchDay.lastMatchDays.toDateString();

  groupMatches.sort((a, b) => {

    if (a.matchDay < b.matchDay) {

      return -1;

    } else if (a.matchDay > b.matchDay) {

      return 1;

    } else {

      return 0;

    }

  });







  const matches = groupMatches;



  //console.log(matches);



  // Return the fixture

  return {

    startDate: startDate,

    endDate: endDate,

    numTeams: numTeams,

    teamNames: teamNames,

    numGroups: numGroups,

    offDays: offDays,

    matches: matches,

    groupMatches: groupMatches,

  };

}


export default CreateFixture