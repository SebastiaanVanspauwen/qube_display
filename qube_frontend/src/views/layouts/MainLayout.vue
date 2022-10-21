<template>
    <div class="flex flex-col min-h-screen">
      <Header />
      <div class="flex-1 justify-center items-center">
        <main class="">
          <section class="min-w-[260px] w-[80%] max-w-[500px] justify-center m-auto">
            <slot />
          </section>
        </main>
      </div>
      <BottomFooter />
    </div>
  </template>