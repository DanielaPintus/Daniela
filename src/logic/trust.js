/* D-R!VE Trust Layer v1.0 — Sanitization, Validation & Plausibility */
import { lsGet } from './storage.js';

function clampNum(v,min,max,fallback){const n=typeof v==="number"?v:parseFloat(v);if(isNaN(n)||!isFinite(n))return fallback;return Math.max(min,Math.min(max,n));}

/* ── Client-profiel sanitizer ── */
function sanitizeClient(raw){
  if(!raw||typeof raw!=="object")return null;
  return{
    ...raw,
    name:typeof raw.name==="string"?raw.name.slice(0,80).trim():"",
    age:clampNum(raw.age,14,100,30),
    height:clampNum(raw.height,120,230,170),
    weight:clampNum(raw.weight,30,250,70),
    target:clampNum(raw.target,1200,5000,2000),
    bmi:clampNum(raw.bmi,10,60,22),
    trainDays:clampNum(raw.trainDays,1,7,3),
    gender:["Man","Vrouw"].includes(raw.gender)?raw.gender:"Vrouw",
    goal:["Vetverlies","Onderhoud","Spieropbouw","Aankomen"].includes(raw.goal)?raw.goal:"Onderhoud",
    activity:typeof raw.activity==="string"?raw.activity:"Matig actief",
    diet:typeof raw.diet==="string"?raw.diet:"Alleseter",
    allergies:Array.isArray(raw.allergies)?raw.allergies:[],
    trainLevel:typeof raw.trainLevel==="string"?raw.trainLevel:"Beginner",
  };
}

/* ── Progress log sanitizer (met plausibiliteitscheck) ── */
function sanitizeProgressLog(raw){
  if(!Array.isArray(raw))return[];
  const clean=[];
  for(const entry of raw){
    if(!entry||typeof entry!=="object")continue;
    if(typeof entry.date!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(entry.date))continue;
    const w=clampNum(entry.weight,30,250,null);
    if(w===null)continue;
    clean.push({
      date:entry.date,
      weight:Math.round(w*10)/10,
      energy:clampNum(entry.energy,1,10,5),
      note:typeof entry.note==="string"?entry.note.slice(0,200):"",
      flagged:!!entry.flagged
    });
  }
  clean.sort((a,b)=>a.date.localeCompare(b.date));
  return clean;
}

/* ── Gewichts-plausibiliteitscheck ── */
const MAX_WEIGHT_CHANGE_PER_ENTRY=5;
function weightPlausibility(newW,prevW){
  if(prevW==null)return{ok:true};
  const diff=Math.abs(newW-prevW);
  if(diff>MAX_WEIGHT_CHANGE_PER_ENTRY)return{ok:false,diff:Math.round(diff*10)/10,prev:prevW};
  return{ok:true};
}

/* ── Wellness-entry sanitizer ── */
function sanitizeWellness(raw){
  if(!raw||typeof raw!=="object")return{};
  const out={};
  if(raw.mood!=null)out.mood=clampNum(raw.mood,0,4,null);
  if(out.mood===null)delete out.mood;
  if(raw.water!=null)out.water=clampNum(raw.water,0,15,3);
  if(raw.sleep!=null)out.sleep=clampNum(raw.sleep,0,24,7);
  if(typeof raw.date==="string")out.date=raw.date;
  return out;
}

/* ── Train history sanitizer ── */
function sanitizeTrainHistory(raw){
  if(!Array.isArray(raw))return[];
  return raw.filter(e=>{
    if(!e||typeof e!=="object")return false;
    if(typeof e.date!=="string"||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(e.date))return false;
    if(typeof e.day!=="string"&&typeof e.day!=="number")return false;
    return true;
  }).map(e=>({
    ...e,
    exercises:Array.isArray(e.exercises)?e.exercises.map(ex=>({
      ...ex,
      weight:typeof ex.weight==="string"||typeof ex.weight==="number"?
        String(clampNum(ex.weight,0,500,"")||""):"",
    })):[]
  })).slice(-60);
}

/* ── Trainingsgewicht validatie ── */
function sanitizeTrainWeight(v){
  if(v===""||v==null)return"";
  const n=parseFloat(v);
  if(isNaN(n)||n<0)return"";
  if(n>500)return"500";
  return String(Math.round(n*10)/10);
}

/* ── Plausibility constants (gebruikt in Voortgang UI + Coach Engine) ── */
const WEIGHT_ABS_MIN=30,WEIGHT_ABS_MAX=250,WEIGHT_MAX_DAILY_DELTA=5;
function isWeightPlausible(newW,prevW){
  if(newW<WEIGHT_ABS_MIN||newW>WEIGHT_ABS_MAX)return{ok:false,reason:`Gewicht moet tussen ${WEIGHT_ABS_MIN} en ${WEIGHT_ABS_MAX} kg zijn.`};
  if(prevW!=null&&Math.abs(newW-prevW)>WEIGHT_MAX_DAILY_DELTA)return{ok:false,reason:`${Math.abs(newW-prevW).toFixed(1)} kg verschil t.o.v. je vorige meting (${prevW} kg) is onwaarschijnlijk. Klopt dit echt?`,warn:true};
  return{ok:true};
}

/* ── Helper: integer clamping ── */
function clampInt(v,min,max,fb){const n=typeof v==="number"?v:parseInt(v,10);if(isNaN(n))return fb;return Math.max(min,Math.min(max,Math.round(n)));}

/* ── Helper: date validation ── */
function isValidDate(s){return typeof s==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(new Date(s).getTime());}

/* ── Helper: sanitize single progress entry ── */
function sanitizeProgressEntry(e){
  if(!e||typeof e!=="object")return null;
  const w=clampNum(e.weight,WEIGHT_ABS_MIN,WEIGHT_ABS_MAX,null);
  if(w===null)return null;
  return{date:isValidDate(e.date)?e.date:new Date().toISOString().slice(0,10),weight:Math.round(w*10)/10,energy:clampInt(e.energy,1,10,5),note:typeof e.note==="string"?e.note.slice(0,200):""};
}

/* ── Helper: sanitize single train entry ── */
function sanitizeTrainEntry(e){
  if(!e||typeof e!=="object"||!isValidDate(e.date))return null;
  return{...e,date:e.date,day:typeof e.day==="string"?e.day.slice(0,30):"",focus:typeof e.focus==="string"?e.focus.slice(0,50):"",level:["Beginner","Gevorderd","Ervaren"].includes(e.level)?e.level:"Beginner",exercises:Array.isArray(e.exercises)?e.exercises.map(ex=>({name:typeof ex.name==="string"?ex.name:"",sets:clampInt(ex.sets,1,20,3),reps:typeof ex.reps==="string"||typeof ex.reps==="number"?String(ex.reps):"—",weight:ex.weight?String(clampNum(ex.weight,0,500,"")):""})).slice(0,30):[]};
}

/* ── Safe localStorage getters (altijd gesanitized) ── */
function safeGetClient(){return sanitizeClient(lsGet("client"));}
function safeGetProgressLog(){return sanitizeProgressLog(lsGet("progress_log",[]));}
function safeGetTrainHistory(){return sanitizeTrainHistory(lsGet("train_history",[]));}
function safeGetWellness(dateKey){return sanitizeWellness(lsGet("wellness_"+dateKey,{}));}

export { clampNum, clampInt, isValidDate, sanitizeClient, sanitizeProgressLog, sanitizeWellness, sanitizeTrainHistory, sanitizeTrainWeight, weightPlausibility, isWeightPlausible, sanitizeProgressEntry, sanitizeTrainEntry, safeGetClient, safeGetProgressLog, safeGetTrainHistory, safeGetWellness };
