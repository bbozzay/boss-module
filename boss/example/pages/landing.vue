<template>
	<div class="landing">
		Landing Page
		<client-only>
			<button v-show="!$auth.loggedIn" @click="$boss.signup('/payment')">Signup</button>
			<button v-show="$auth.loggedIn" @click="$router.push('/payment')">Payment</button>
		</client-only>
	</div>
</template>