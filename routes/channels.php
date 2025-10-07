<?php

use Illuminate\Support\Facades\Broadcast;

// Authenticate User with Laravel Echo
Broadcast::routes(['middleware' => ['auth:sanctum']]);

// Authorize Private Channel
Broadcast::channel('users.{id}', fn ($user, $id) => (int) $user->id === (int) $id);

