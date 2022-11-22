import Head from "next/head"
import { SidebarProvider } from "../context/SidebarContext"
import ActualSidebar from "./ActualSidebar"
import Header from "./Header"
import ToastList from "./ToastList";

type Props = {
  title?: string;
  tsize? : 1 | 2 | 4 | 5;
  children?: React.ReactNode;
};

//export default function Layout( {children}: React.PropsWithChildren<{}>) {
export function Layout0(  {title, children } : Props) {

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="ft" content="ft_trans" />
        <link rel="icon" href="/42.png" />
      </Head>
        <div className="flex dark:bg-gray-900">
          <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem]">
            {children}
          </main>
        </div>
    </div>
  );
}

export default function Layout(  {title, children } : Props) {

  return (
    <Layout0 title={title}>
      {/*<SocketContext.Provider value={socket}>*/}
      <SidebarProvider>
        <Header />
        <div className="flex dark:bg-gray-900">
          <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem]">
            <div className=" h-20 w-full overflow-y-auto">
              <ToastList/>
            </div>
            {children}
          </main>
          <div className="order-1">
            <ActualSidebar />
          </div>
        </div>
      </SidebarProvider>
      {/*</SocketContext.Provider>*/}
    </Layout0>
  );
}



export function Section ({title, tsize, children } : Props)  {
  return (
    <div className="">
      <section>
        <header>
          <h1 className={`mb-9 text-${tsize}xl dark:text-gray-200`}>
            <code>{title}</code>
          </h1>
        </header>
        {children}
      </section>
    </div>
  );
}
