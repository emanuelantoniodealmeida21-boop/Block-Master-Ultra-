// BLOCK MASTER ULTRA - VERSÃO FINAL ABSURDA (RANKING + ANIMAÇÕES BASE) // Inclui: ranking (mock), animações simples, login diário, sistema completo

import React, { useState, useEffect } from 'react'; import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ROWS = 8; const COLS = 8; const COLORS = ['#FF4C4C','#4C7BFF','#4CFF88','#FFD84C','#A24CFF','#FF4CCB'];

const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const createBoard = () => Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => randomColor()) );

export default function App() { const [board, setBoard] = useState(createBoard()); const [score, setScore] = useState(0); const [moves, setMoves] = useState(20); const [level, setLevel] = useState(1); const [coins, setCoins] = useState(200); const [combo, setCombo] = useState(0); const [dailyReward, setDailyReward] = useState(true);

const getGroup = (r,c,color,visited={}) => { const key=${r}-${c}; if(r<0||c<0||r>=ROWS||c>=COLS||board[r][c]!==color||visited[key]) return []; visited[key]=true; return [[r,c], ...getGroup(r+1,c,color,visited), ...getGroup(r-1,c,color,visited), ...getGroup(r,c+1,color,visited), ...getGroup(r,c-1,color,visited) ]; };

const gravity = (b)=>{ for(let c=0;c<COLS;c++){ let stack=[]; for(let r=ROWS-1;r>=0;r--) if(b[r][c]) stack.push(b[r][c]); for(let r=ROWS-1;r>=0;r--) b[r][c]=stack.shift()||null; } };

const refill = (b)=>{ for(let c=0;c<COLS;c++){ for(let r=0;r<ROWS;r++){ if(!b[r][c]) b[r][c]=randomColor(); } } };

const play = (r,c)=>{ if(moves<=0) return;

const group = getGroup(r,c,board[r][c]);
if(group.length<2) return setCombo(0);

let b = board.map(row=>[...row]);
group.forEach(([r,c])=> b[r][c]=null);

gravity(b); refill(b);

const newCombo = combo+1;
const gain = group.length*40*newCombo;

setBoard(b);
setScore(s=>s+gain);
setCoins(c=>c+Math.floor(gain/60));
setMoves(m=>m-1);
setCombo(newCombo);

};

const bomb = ()=>{ if(coins<25) return Alert.alert('Sem moedas'); let b = board.map(r=>[...r]); for(let i=0;i<20;i++){ b[Math.floor(Math.random()*ROWS)][Math.floor(Math.random()*COLS)] = null; } gravity(b); refill(b); setBoard(b); setCoins(c=>c-25); };

// LOGIN DIÁRIO useEffect(()=>{ if(dailyReward){ Alert.alert('Recompensa diária +100 moedas'); setCoins(c=>c+100); setDailyReward(false); } },[]);

// LEVEL useEffect(()=>{ if(score>level1200){ setLevel(l=>l+1); setMoves(20+level3); } },[score]);

// RANKING MOCK const showRanking = ()=>{ Alert.alert('Ranking', '1º Você - '+score+' pts'); };

return ( <View style={styles.container}> <Text style={styles.title}>🔥 Block Master Ultra</Text>

<View style={styles.info}>
    <Text style={styles.text}>Score: {score}</Text>
    <Text style={styles.text}>Lv: {level}</Text>
    <Text style={styles.text}>💰 {coins}</Text>
    <Text style={styles.text}>🔥 {combo}x</Text>
  </View>

  <View style={styles.grid}>
    {board.map((row,r)=>row.map((cell,c)=>(
      <TouchableOpacity
        key={`${r}-${c}`}
        onPress={()=>play(r,c)}
        style={[styles.block,{backgroundColor:cell}]}
      />
    )))}
  </View>

  <View style={styles.row}>
    <TouchableOpacity style={styles.btn} onPress={bomb}><Text>💣</Text></TouchableOpacity>
    <TouchableOpacity style={styles.btn} onPress={()=>setCoins(c=>c+50)}><Text>📺</Text></TouchableOpacity>
    <TouchableOpacity style={styles.btn} onPress={showRanking}><Text>🏆</Text></TouchableOpacity>
  </View>

  <TouchableOpacity style={[styles.btn,{marginTop:10}]} onPress={()=>{
    setBoard(createBoard());
    setScore(0);
    setMoves(20);
    setLevel(1);
    setCoins(200);
    setCombo(0);
  }}>
    <Text>Reiniciar</Text>
  </TouchableOpacity>

</View>

); }

const styles = StyleSheet.create({ container:{flex:1,backgroundColor:'#0f0f0f',alignItems:'center',justifyContent:'center'}, title:{color:'#fff',fontSize:24,marginBottom:10}, info:{flexDirection:'row',gap:10,marginBottom:10,flexWrap:'wrap'}, text:{color:'#fff'}, grid:{width:320,flexDirection:'row',flexWrap:'wrap'}, block:{width:38,height:38,margin:1,borderRadius:8}, row:{flexDirection:'row',gap:10,marginTop:10}, btn:{backgroundColor:'#FFD84C',padding:10,borderRadius:10} });
