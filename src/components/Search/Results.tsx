import "solid-js";
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import Pagination from "./Pagination";

const getProject = async (result: any) => {
  return await result.data();
};

const PAGE_SIZE = 10;

const Result = ({ result }: { result: any }) => {
  const [project] = createResource(result, getProject);

  return (
    // <a href={project().url} class="cursor-pointer"
    <Show when={!!project()}>
      <li class="flex flex-col sm:flex-row bg-white bg-opacity-10 text-white rounded-md mb-2 no-underline">
        <article class="flex flex-row items-center ">
          <div class="p-5">
            <a href={project().url} class="cursor-pointer">
              <img
                src={project().meta.image}
                width="50px"
                class="min-h-[50px] min-w-[50px]"
              />
            </a>
          </div>
          <div class="border-l border-gray-500 flex-grow">
            <a href={project().url} class="cursor-pointer">
              <h2 class="font-bold text-xl p-3 ">{project()?.meta.title}</h2>
            </a>
            <div class="px-3 flex flex-col sm:flex-row gap-3 mb-3 flex-wrap">
              <p>
                <b>Categories: </b>
                <span>{project().filters.categories.join(", ")}</span>
              </p>
              <p>
                <b>Compatibility: </b>
                <span>{project().filters.compatibility.join(", ")}</span>
              </p>
              <p class="break-all text-orange-200">
                <b>Version:&nbsp;</b>
                <span class="min-w-0">{project()?.meta.versionFrom}</span>
              </p>
            </div>
          </div>
        </article>
        <a
          class="p-5 text-5xl text-blue-500 cursor-pointer align-middle hidden flex-grow-0 sm:block sm:flex-grow text-right"
          href={project().url}
        >
          »
        </a>
      </li>
    </Show>
    // </a>
  );
};

const Results = ({ results, search, clearSearch }: any) => {
  const [page, setPage] = createSignal(1);
  const [pageCount, setPageCount] = createSignal(0);
  const [paginatedResults, setPaginatedResults] = createSignal([]);

  createEffect(() => {
    setPageCount(Math.ceil(results()?.results?.length / 10));
  });

  createEffect(() => {
    setPaginatedResults(
      results()?.results.slice((page() - 1) * PAGE_SIZE, page() * PAGE_SIZE)
    );
  });

  createEffect(() => {
    if (search()) {
      setPage(1);
    }
  });

  return (
    <div class="w-full my-6">
      <Switch fallback={<></>}>
        <Match when={results.loading}>
          <div class="w-full flex flex-col items-center gap-3 p-10">
            Loading results...
          </div>
        </Match>
        <Match when={!search() || !results() || results().results.length > 0}>
          <ul>
            <For each={paginatedResults()}>
              {(result) => <Result result={result} />}
            </For>
          </ul>
        </Match>
        <Match when={results().results.length === 0}>
          <div class="w-full flex flex-col items-center gap-3 p-10">
            No Results
            <button
              class="px-10 py-2 bg-white hover:bg-slate-300 border-white text-black font-bold border rounded-full"
              onClick={clearSearch}
            >
              Clear search
            </button>
          </div>
        </Match>
      </Switch>
      <Pagination
        page={page}
        pageCount={pageCount}
        setPage={setPage}
        total={results()?.results.length}
      />
    </div>
  );
};

export default Results;
