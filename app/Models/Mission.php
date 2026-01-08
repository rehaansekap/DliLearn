<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    protected $guarded = [];

    public function prerequisite()
    {
        return $this->belongsTo(Mission::class, 'prerequisite_mission_id');
    }

    public function dependentMissions()
    {
        return $this->hasMany(Mission::class, 'prerequisite_mission_id');
    }
}
