<?php
/**
 * Created by PhpStorm.
 * User: wassim
 * Date: 08/02/2017
 * Time: 19:08
 */

namespace Group\GroupBundle\Repository;


class ImageRepository extends \Doctrine\ORM\EntityRepository
{

    
    
    
    public function getimagestring($id){

        $img = $this->getEntityManager()
            ->createQuery('SELECT i.listImage FROM GroupGroupBundle:Groupe i  
                WHERE i.id =:id')
            ->setParameter('id',$id);



        return $img->getResult();

    }
    public function getimagelist($list){

        $imageId = explode('-',$list);


        $images = $this->getEntityManager()
            ->createQuery(
                'SELECT i.lien
             FROM GroupGroupBundle:Image i
             WHERE i.id IN(:id)'
            )
            ->setParameter('id',array_values($imageId))
            ->getResult();


        return $images;

    }


    public function getphotonumber($id){

        $number = $this->getEntityManager()
            ->createQuery(
                'SELECT COUNT(l.id)
             FROM GroupGroupBundle:Groupe g JOIN g.listimage l
             WHERE g.id IN(:id)'
            )
            ->setParameter('id',$id)
            ->getSingleScalarResult();


        return $number;

    }



    public function getgroupephotos($id){

        $photos = $this->getEntityManager()
            ->createQuery(
                'SELECT (l.lien)
             FROM GroupGroupBundle:Groupe g JOIN g.listimage l
             WHERE g.id IN(:id)'
            )
            ->setParameter('id',$id)
            ->getResult();


        return $photos;

    }
}