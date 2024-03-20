const futileCodes = ['403', '404', '507', '508', '511'];

type Summary = {
  error: string,
  responseCode: number,
  responseBody: string
}

interface RobustFetchParams {
  url: string;
  options?: RequestInit;
  retries?: number;
  timer?: number;
  verbose?: boolean;
  logger?: (summary: Summary) => void;
}

export default function robustFetch<T>({ url, options, retries = 3, timer = 300, verbose, logger }: RobustFetchParams): Promise<T|Error> {
  // const isVerbose = typeof verbose !== 'undefined' ? verbose : import.meta.env.MODE === 'dev' || import.meta.env.MODE === 'testing'; // Vite SPA
  const isVerbose = typeof verbose !== 'undefined' ? verbose : process.env.NODE_ENV === 'development'; // Next.js

  let currentResponse: Response;

  return fetch(url, options)
    .then(response => {
      currentResponse = response;

      if(!response.ok) {
        throw new Error(`${response.status}`);
      }

      return response.json().catch(() => {
        throw new Error('json');
      });
    }).catch(async error => {

      // Aborted. Exit without logging
      if(options?.signal?.aborted) {
        throw error; // exit, no retries.
      }

      // Ended with failure, log if needed
      if(retries === 0 || futileCodes.indexOf(error.message) >= 0 || error.message === 'json') {
        const summary: Summary = {
          error: error.message,
          responseCode: currentResponse.status,
          responseBody: await currentResponse.text()
        }
        isVerbose && console.log('Fetch failed', summary);
        logger?.(summary);

        throw error; // exit, no retries.
      }

      // Failure, but can retry
      isVerbose && console.log(`Retrying fetch (${url})... Attempts left: ${retries}`, error.message);
      return new Promise(resolve => setTimeout(resolve, timer))
        .then(() => robustFetch({url, options, retries: retries - 1, timer: timer * 2, verbose, logger}));
    });
}