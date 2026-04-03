/* D-R!VE Shared UI Components */
import { useState } from "react";
import { sH, sC } from '../logic/audio.js';

/* ═══ SHARED UI ═══ */
function Fonts(){return <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>;}
function GBtn({children,t,onClick,full,disabled,small}){const[h,setH]=useState(false);const[pressed,setPressed]=useState(false);return <button onClick={()=>{if(!disabled){sC();setPressed(true);setTimeout(()=>setPressed(false),150);onClick?.();}}} onMouseEnter={()=>{if(!disabled){setH(true);sH();}}} onMouseLeave={()=>setH(false)} style={{width:full?"100%":"auto",padding:small?"7px 13px":"12px 22px",borderRadius:12,border:"none",background:t.gradientBtn,color:"#fff",fontSize:small?11:13,fontWeight:600,cursor:disabled?"default":"pointer",fontFamily:"inherit",transition:"all .2s cubic-bezier(.4,0,.2,1)",boxShadow:h?`0 4px 24px ${t.glowStrong}`:`0 2px 8px ${t.glow}`,transform:pressed?"scale(0.96)":h?"translateY(-2px) scale(1.02)":"none",opacity:disabled?.4:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6}}>{children}</button>;}
function Back({t,onClick}){return <button onClick={()=>{sC();onClick();}} onMouseEnter={sH} style={{background:"transparent",border:`1.5px solid ${t.line}`,borderRadius:10,padding:"8px 16px",color:t.textMuted,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}} onMouseOver={e=>e.currentTarget.style.borderColor=t.accent} onMouseOut={e=>e.currentTarget.style.borderColor=t.line}>← Terug</button>;}
function Card({t,children,s={},onClick}){const[h,sH2]=useState(false);return <div onClick={onClick} onMouseEnter={()=>sH2(true)} onMouseLeave={()=>sH2(false)} style={{background:t.cardBg,border:`1px solid ${h&&onClick?t.accent:t.cardBorder}`,borderRadius:14,padding:20,transition:"all .25s cubic-bezier(.4,0,.2,1)",transform:h&&onClick?"translateY(-2px)":"none",boxShadow:h&&onClick?`0 4px 20px ${t.glow}`:"none",cursor:onClick?"pointer":"default",...s}}>{children}</div>;}
function Lbl({t,children}){return <div style={{fontSize:11,fontWeight:500,letterSpacing:".15em",textTransform:"uppercase",color:t.accent,marginBottom:12}}>{children}</div>;}
function Tag({t,children,color}){return <span style={{fontSize:10,fontWeight:500,padding:"3px 9px",borderRadius:20,background:color||t.tagBg,border:`1px solid ${t.tagBorder}`,color:t.tagColor,whiteSpace:"nowrap"}}>{children}</span>;}


/* ═══ SUB-TABS COMPONENT ═══ */
function SubTabs({tabs,active,onChange,t}){return(
  <div style={{display:"flex",gap:2,padding:3,borderRadius:14,background:t.inputBg,border:`1px solid ${t.line}`,marginBottom:16,boxShadow:"inset 0 1px 3px rgba(0,0,0,.04)"}}>
    {tabs.map(tab=>{const isActive=active===tab.id;return <button key={tab.id} onClick={()=>{sC();onChange(tab.id);}} onMouseEnter={sH} style={{flex:1,padding:"10px 8px",borderRadius:11,border:"none",background:isActive?t.cardBg:"transparent",color:isActive?t.text:t.textMuted,fontSize:12,fontWeight:isActive?600:400,cursor:"pointer",fontFamily:"inherit",transition:"all .25s",boxShadow:isActive?`0 1px 4px ${t.glow}`:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
      {tab.icon&&<span style={{fontSize:14}}>{tab.icon}</span>}
      <span>{tab.label}</span>
    </button>;})}
  </div>
);}


export { Fonts, GBtn, Back, Card, Lbl, Tag, SubTabs };
