import { Flowbite } from "flowbite-react";
import { AppProps } from "next/app";
import { FC, Suspense, ReactNode, useState, useEffect } from "react";
//import { ErrorBoundary } from "react-error-boundary";
import "../styles/globals.css";
import { flowbiteTheme as theme } from "../theme";
import { RecoilRoot } from "recoil";
import { RecoilUtilsComponent } from "../recoil/recoilUtils";
import dynamic from "next/dynamic";
import { SocketContext, socket } from "../context/SocketContext";

function SafeHydrate({ children }: {children: ReactNode}) {

  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

const App: FC<AppProps> = function ({ Component, pageProps }): JSX.Element {
  return (
    <SafeHydrate>
    <SocketContext.Provider value={socket}>
    <RecoilRoot>
    <RecoilUtilsComponent />
    {/*<ErrorBoundary
      fallback={
        <div className="flex items-center justify-center">
          <Spinner size="lg" /> Error!
        </div>
      }
    >*/}
      <Suspense>
        {/*fallback={
          <div className="flex items-center justify-center">
            <Spinner size="lg" /> Loading...
          </div>
        }
      >*/}
        <Flowbite theme={{ theme }}>
          <Component {...pageProps} />
        </Flowbite>

      </Suspense>
    {/*</ErrorBoundary>*/}
    </RecoilRoot>
    </SocketContext.Provider>
    </SafeHydrate>

  );
};

//export default App;

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
