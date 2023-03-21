export default function Footer() {
  return (
    <footer className="p-4 bg-white sm:p-6 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="https://meshjs.dev/" className="flex items-center">
              <img
                src="https://meshjs.dev/logo-mesh/white/logo-mesh-white-128x128.png"
                className="mr-3 h-8"
                alt="Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Mesh SDK
              </span>
            </a>
          </div>
          <div className="grid grid-cols-1 gap-8 text-gray-900 dark:text-white">
            <div>
              <h2 className="mt-6 text-sm font-semibold uppercase">
                Powered by Mesh
              </h2>
              <p>This starter kit is developerd by Mesh SDK team.</p>

              <h2 className="mt-6 text-sm font-semibold uppercase">
                Theme by Tailwind CSS
              </h2>
              <p>The layout are designed are by Tailwind CSS.</p>

              <h2 className="mt-6 text-sm font-semibold uppercase">
                Images by QWSTION
              </h2>
              <p>The images are provided by QWSTION and Ugmonk.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
