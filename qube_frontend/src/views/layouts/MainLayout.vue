<template>
    <div class="flex flex-col min-h-screen">
      <Header />
      <div class="flex-1 justify-center items-center">
        <main class="">
          <section class="justify-center m-auto">
            <slot />
          </section>
        </main>
      </div>
      <BottomFooter />
    </div>
  </template>