<?php
/**
 * Created by PhpStorm.
 * User: cimope
 * Date: 07/02/2017
 * Time: 02:52
 */

namespace MainBundle\Entity;


use Doctrine\ORM\Mapping as ORM;
use Mgilet\NotificationBundle\Model\AbstractNotification;

/**
 * @ORM\Entity
 * @ORM\Table(name="notification")
 */
class Notification extends AbstractNotification
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var Member
     * @ORM\ManyToOne(targetEntity="MainBundle\Entity\Member",inversedBy="notifications",cascade={"all"})
     */
    protected $user;


    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return Member
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param Member $user
     * @return Notification
     */
    public function setUser($user)
    {
        $this->user = $user;
        $user->addNotification($this);

        return $this;
    }
}