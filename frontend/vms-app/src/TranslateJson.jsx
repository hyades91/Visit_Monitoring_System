import React from 'react'

const TranslateJson = ({ jsonFile}) => {
  return jsonFile.payload.map(visit=>{
    switch (visit.status){
      case "Folyamatban": visit.status="Open";
      case "Kész": visit.status="Finished";
      case "Elkezdve": visit.status="Started";
    }
    switch (visit.reason){
      case "Általános": visit.reason="Regular";
      case "Eseti": visit.reason="On-Call";
    }
  })

  };

export default TranslateJson