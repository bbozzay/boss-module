<template>
	<div>
		Account Page
		<client-only>
			<div v-if="$auth.user">
				<img :src="$auth.user.picture" />
				<p>{{ $auth.user.email }}</p>
			</div>
		</client-only>
	</div>
</template>