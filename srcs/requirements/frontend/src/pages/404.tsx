import type { NextPage } from "next";
import {
  Alert,
} from "flowbite-react";

import {
  HiEye,
  HiHome,
} from "react-icons/hi";

import React from "react";
import { useRouter } from 'next/router'
import { Layout0, Section } from "../components/Layout";

const Http404: NextPage = () => {
  return (
    <Layout0 title="404 - trans_front">
      <Http404Page />
    </Layout0>
  );
}
export default Http404;


const Http404Page: React.FC = () => {
  return (
    <div className="">
      <Section title="404 - Not Found" tsize={2}>
      <Http404Alerts />
      </Section>
    </div>
  );
}

const Http404Alerts: React.FC = () => {
  const router = useRouter();
  return (
    <Alert
      color="success"
      rounded={false}
      withBorderAccent
      onDismiss={console.log}
      additionalContent={
        <React.Fragment>
          <div className="mt-2 mb-4 text-sm text-green-700 dark:text-green-800">
            In computer network communications, the HTTP 404, 404 not found, 404, 404 error, page not found or file not found error message is a hypertext transfer protocol (HTTP) standard response code, to indicate that the browser was able to communicate with a given server, but the server could not find what was requested. The error may also be used when a server does not wish to disclose whether it has the requested information.
          </div>
          <div className="flex">

            <button
              type="button"
              onClick={()=>router.push("https://en.wikipedia.org/wiki/HTTP_404")}
              className="mr-2 inline-flex items-center rounded-lg bg-green-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-800 dark:hover:bg-green-900"

              >
              <HiEye className="-ml-0.5 mr-2 h-4 w-4" />
              View more
            </button>
            <button
              type="button"
              onClick={()=>router.push("/")}

              className="mr-2 inline-flex rounded-lg border border-green-700 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-green-700 hover:bg-green-800 hover:text-white focus:ring-4 focus:ring-green-300 dark:border-green-800 dark:text-green-800 dark:hover:text-white"
            >
              <HiHome className="-ml-0.5 mr-2 h-4 w-4" />
              Back to Home
            </button>

          </div>
        </React.Fragment>
      }
    >
      <h3 className="text-lg font-medium text-green-700 dark:text-green-800">
        "404 Not Found" redirects here.
      </h3>
    </Alert>
  );
}


//https://en.wikipedia.org/wiki/HTTP_404
