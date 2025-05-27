import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentForm as StudentFormSafe } from "./StudentFormSafe";
import { StudentForm as StudentFormUnsafe } from "./StudentFormUnsafe";

export function FormTabs() {
  return (
    <Tabs defaultValue="safe" className="flex flex-col mx-auto mt-8 w-full">
      <TabsList className="grid grid-cols-2 w-[290px] lg:w-[350px] mx-auto items-center h-10">
        <TabsTrigger value="safe" className="font-semibold">
          Sigurno
        </TabsTrigger>
        <TabsTrigger value="unsafe" className="font-semibold">
          Nesigurno
        </TabsTrigger>
      </TabsList>
      <TabsContent value="safe">
        <StudentFormSafe />
      </TabsContent>
      <TabsContent value="unsafe">
        <StudentFormUnsafe />
      </TabsContent>
    </Tabs>
  );
}
