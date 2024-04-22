import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline flex justify-center text-red-600">
        ZipFeast Front-end
      </h1>
      <h2 className="flex justify-center text-red-600">
        We are Using React.js + TypeScript + Shadcn-ui
      </h2>
      <Button variant={"destructive"}>Shadcn-Ui Button</Button>
    </>
  );
}

export default App;
