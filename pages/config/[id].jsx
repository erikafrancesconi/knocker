import Layout from "components/Layout";
import router from "next/router";

const ConfigItem = ({ item }) => {
  const submitForm = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/db/config/add", {
      body: JSON.stringify({
        name: e.target.name.value,
        file: e.target.filePath.value,
        fileType: e.target.fileType.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (res.ok) {
      router.push("/config");
    }
  };
  return (
    <Layout title={item.id ? "Edit Configuration" : "New Configuration"}>
      <form onSubmit={submitForm}>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Configuration Name
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="file-path"
                  className="block text-sm font-medium text-gray-700"
                >
                  Configuration File
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="filePath"
                    id="file-path"
                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                    required
                  />
                </div>
              </div>
            </div>
            <fieldset>
              <div>
                <legend className="text-sm font-medium text-gray-700 mb-1">
                  File Type
                </legend>
              </div>
              <div>
                <div className="flex items-center">
                  <input
                    id="dockerfile"
                    name="fileType"
                    type="radio"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    value="0"
                    required
                  />
                  <label
                    htmlFor="dockerfile"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Docker File
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="docker-compose"
                    name="fileType"
                    type="radio"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    value="1"
                    required
                  />
                  <label
                    htmlFor="docker-compose"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Docker Compose File
                  </label>
                </div>
              </div>
            </fieldset>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  return {
    paths: [{ params: { id: "new" } }],
    fallback: false,
  };
};

export const getStaticProps = ({ params }) => {
  // const evento = eventi.filter((ev) => ev.id === params.id)[0];
  return {
    props: {
      item: {},
    },
  };
};

export default ConfigItem;
