import Image from "next/image";
import router from "next/navigation";

export default function Home() {
  return (
    <>
      <div className="bg-zinc-50">Scheduler App Login</div>
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div 
        onclick={() => router.push("/login")}
        >Login</div>
        <div>Register</div>
      </div>
    </>
  );
}
