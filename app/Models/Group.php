<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $guarded = [];

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function members()
    {
        return $this->hasMany(GroupMember::class);
    }
}
