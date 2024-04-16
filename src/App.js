import './App.css';
import CollegeDuniya from './Components/CollegeDuniya';
import dummyData from './Components/Data';
function App() {
  return (
    <div className="App">
      <CollegeDuniya dummyData = {dummyData}/>
    </div>
  );
}

export default App;
