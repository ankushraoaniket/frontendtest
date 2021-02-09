import React, { useEffect, useState } from 'react'
import axios from 'axios';
import moment from 'moment-timezone'
import './App.css';
import SearchBox from './SearchBox';
import { Row } from 'react-bootstrap';

function App() {

  const [state, setState] = useState({
    playerList: [],
    originalPlayerList: [],
    isLoading: true
  })

  useEffect(() => {
    axios.get(`https://api.npoint.io/d6bd0efc05639084eb17/`)
      .then(res => {
        const list = res.data;
        list.playerList.sort((a, b) => {
          if (a.Value) {
            let ValueA = parseFloat(a.Value);
            let ValueB = parseFloat(b.Value);
            return (ValueA < ValueB) ? -1 : (ValueA > ValueB) ? 1 : 0;
          }
        })
        setState(prevState => {
          let newState = {
            ...prevState,
            originalPlayerList: list.playerList,
            playerList: list.playerList,
            isLoading: false
          }
          return newState
        });
      })
  }, [])
  console.log(state)
  var sone = moment.tz.guess();

  const setSearchText = (searchedValue) => {
    let playerList = []
    if (searchedValue !== '' && searchedValue !== undefined) {
      state.originalPlayerList.filter((item) => {
        if (item.TName.toLowerCase().match(searchedValue.toLowerCase()) || item.PFName.toLowerCase().match(searchedValue.toLowerCase())) { //AC** Can this hardcoding be avoided ?
          playerList.push(item)
        }
        return null
      })
    } else {
      state.originalPlayerList.map((item) => {
        playerList.push(item)
        return null
      })
    }
    setState(prevState => {
      let newState = {
        ...prevState,
        playerList: playerList,
        searchedValue: searchedValue
      }
      return newState
    })
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingBottom: '20px'
    }}>
      <Row noGutters style={{ width: "100%" }}>
        <div style={{
          paddingTop: "0.625rem",
          paddingBottom: "0.625rem",
          width: "25%"
        }}>
          <SearchBox
            displaySearchIcon={false}
            setSearchText={setSearchText}
            clearValue={false}
            searchBoxInputStyle={formControlStyle}
            searchButtonStyle={searchButtonStyle}
          />
        </div>
      </Row>
      {
        !state.isLoading ?
          <Row noGutters style={{ width: "100%" }}>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
              height: "100%",
              // justifyContent: "space-between"
            }}>
              {
                state.playerList.length > 0 ?
                  state.playerList.map((p, pI) => (
                    <React.Fragment key={`fr${p.Id}`}>
                      <div style={{ display: "flex", width: "25%", flexDirection: "column", alignItems: "center" }}>
                        {console.log(p)}
                        <img
                          src={process.env.PUBLIC_URL + `/player-images/${p.Id}.jpg`}
                          alt={p.PFName}
                          style={{ height: "20rem", width: "20rem" }}
                        />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span>{p.PFName}</span>
                          <span>{p.SkillDesc}</span>
                          <span>{"$" + p.Value}</span>
                          <span>{p.UpComingMatchesList[0].CCode ? `Upcoming match : ${p.UpComingMatchesList[0].CCode} vs ${p.UpComingMatchesList[0].VsCCode}` : "Upcoming match : NA"}</span>
                          {/* <span>{"Match Time : " + moment().tz(sone).format("DD-MM-YYYY h:mm:ss a")}</span> */}
                          <span>{"Match Time : " + moment().utc(p.UpComingMatchesList[0].MDate).local().format("DD-MM-YYYY h:mm:ss a")}</span>
                        </div>
                      </div>
                    </React.Fragment>
                  ))
                  : null
              }
            </div>
          </Row>
          : null
      }
      {/* <img
        src={process.env.PUBLIC_URL + "/data/icons/refresh.svg"}
        alt="Reload"
        style={{ ...buttonDiv.imageStyle }}
      />
      {profiles && profiles.length > 0
        ? profiles.map((p, pI) => (
          <React.Fragment key={`fr${pI}`}>
            <span>{p.fullname}</span>
            <ul className="grid_list" key={pI}>
              {p.skills.map((s, i) => {
                console.log(`${pI}${i}`);
                return <li key={`${pI}${i}`}>{s.name}</li>;
              })}
            </ul>
          </React.Fragment>
        ))
        : null} */}
    </div>
  );
}

export default App;

const formControlStyle = {
  height: "2.623rem",
  width: "100%",
  border: "1px solid #453c9e",
  padding: "0.5rem 0.75rem",
  borderRadius: "0.25rem",
  color: "#7d7d7d"
  // borderBottomLeftRadius:"0.25rem"
}

const searchButtonStyle = {
  borderTopRightRadius: '18px',
  borderBottomRightRadius: '18px',
  backgroundColor: '#f97b28',
  borderColor: '#f97b28',
  outline: 'none',
  width: '3rem'
}