'use client'

import Styles from './find.module.css'
import DongariInList from './DongariInList';
import { useEffect, useState } from 'react';
import College from '../../public/College.json';

export default function Find() {
  const [Groups, setGroups] = useState([]);

  const [CollegeSelected, setCollegeSelected] = useState("all");
  const handleCollegeSelect = (e) => {
    setCollegeSelected(e.target.value);
  }

  const sortingList = [
    { value: "registration", name: "등록 순"},
    { value: "name", name: "이름 순"},
    { value: "deadline", name: "모집 마감 순"},
    { value: "popularity", name: "인기 순"},
  ]

  const [SortSelected, setSortSelected] = useState("registration");
  const handleSortSelect = (e) => {
    setSortSelected(e.target.value);
  }

  const GetClubs = async () => {
    const getURL = new URL('http://localhost:3000/api/clubs');
    const urlParams = new URLSearchParams('');
    urlParams.append("sortBy", SortSelected);
    if (CollegeSelected !== "all") {
      urlParams.append("college", CollegeSelected);
    }
    console.log(urlParams.toString());
    const rows = await fetch(getURL + '?' + urlParams.toString(), {
      method: "GET"
    });
    const jsonData = await rows.json();
    setGroups(jsonData);
  }

  useEffect(() => {
    GetClubs();
  }, [SortSelected, CollegeSelected])

  return (
    <div className={Styles.Vertical_Div}>
      <div className={Styles.Horizontal_Div}>
        <input className={Styles.SearchBar} placeholder='검색해보세요 !'/>
        <div className={Styles.Selector}>
          <select className={Styles.MenuFont} onChange={handleCollegeSelect} value={CollegeSelected}>
            {
              Object.entries(College).map(([key, value]) => {
                return (
                  <option value={key} key={key}>{value}</option>
                )
              })
            }
          </select>
          <select className={Styles.MenuFont} onChange={handleSortSelect} value={SortSelected}>
            {
              sortingList.map((item) => {
                return <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              })
            }
          </select>
        </div>
        
      </div>
      <div className={Styles.ListBox}>
        {
          Groups.map((club,index)=>{
            return(
              <div className={Styles.ClubRow}>
                <DongariInList 
                  club={club}
                  i={index} 
                  key={club.id}
                />
              </div>
            );
          })
        }
      </div>
    </div>
  )
}
